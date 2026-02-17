import { NextResponse } from "next/server";

export async function GET() {
	return NextResponse.json(
		{
			message: "Round endpoint is not implemented yet",
		},
		{ status: 501 }
	);
}
