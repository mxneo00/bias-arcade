import { NextResponse } from "next/server";

const isFirebaseAuthErrorCode = (error: unknown, code: string): boolean => {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  return "code" in error && (error as { code?: string }).code === code;
};

type FirebaseAuthApiError = {
  error?: {
    message?: string;
  };
};

type FirebaseSignUpSuccess = {
  localId: string;
  email: string;
  idToken: string;
};

type FirebaseUpdateSuccess = {
  displayName?: string;
};

const getFirebaseApiKey = (): string => {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

  if (!apiKey) {
    throw new Error("Missing required environment variable: NEXT_PUBLIC_FIREBASE_API_KEY");
  }

  return apiKey;
};

const createFirebaseUser = async (email: string, password: string): Promise<FirebaseSignUpSuccess> => {
  const apiKey = getFirebaseApiKey();
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
    }
  );

  const data = (await response.json()) as FirebaseSignUpSuccess | FirebaseAuthApiError;

  if (!response.ok) {
    const errorMessage = (data as FirebaseAuthApiError).error?.message ?? "UNKNOWN_ERROR";
    throw { code: `auth/${errorMessage.toLowerCase().replace(/_/g, "-")}` };
  }

  return data as FirebaseSignUpSuccess;
};

const updateFirebaseDisplayName = async (
  idToken: string,
  displayName: string
): Promise<FirebaseUpdateSuccess | null> => {
  const apiKey = getFirebaseApiKey();
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idToken,
        displayName,
        returnSecureToken: true,
      }),
    }
  );

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as FirebaseUpdateSuccess;
};

type SignupPayload = {
  email?: string;
  password?: string;
  name?: string;
};

export async function POST(request: Request) {
  const payload = (await request.json()) as SignupPayload;

  const email = payload.email?.trim().toLowerCase();
  const password = payload.password;
  const name = payload.name?.trim() || null;

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 }
    );
  }

  try {
    const signUpResult = await createFirebaseUser(email, password);
    const updateResult = name
      ? await updateFirebaseDisplayName(signUpResult.idToken, name)
      : null;

    return NextResponse.json(
      {
        user: {
          id: signUpResult.localId,
          email: signUpResult.email,
          name: updateResult?.displayName ?? name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (
      isFirebaseAuthErrorCode(error, "auth/email-already-exists") ||
      isFirebaseAuthErrorCode(error, "auth/email-exists")
    ) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    return NextResponse.json({ error: "Unable to create account." }, { status: 500 });
  }
}