import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/server/auth";
import CollectionPageClient from "@/components/collections/collection-page-client";

export default async function CollectionPage() {
	const session = await getServerSession(authOptions);

	if (!session?.user) {
		redirect("/login?callbackUrl=/collection");
	}

	return <CollectionPageClient />;
}
