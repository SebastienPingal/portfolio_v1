import { ExternalLink } from "@prisma/client"
import { Factory, MoveUpRight, Plus } from "lucide-react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { useTheme } from "next-themes"
import { NavigationMenuItem } from "./ui/navigation-menu"
import ExternalLinkAddDialog from "./externalLinkAddDialog"
import DeleteConfirmationPopover from "./DeleteConfirmationPopover"
import { deleteExternalLink } from "@/app/actions"

export default function ExternalLinksSession({ externalLinks }: { externalLinks: ExternalLink[] }) {
	const session = useSession()
	const { theme } = useTheme()
	const isAdmin = session.data && session.data.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL

	return <>
		{externalLinks.length > 0 && (
			<div className="flex flex-col gap-2">
				{externalLinks.map((externalLink) => (
					<NavigationMenuItem key={externalLink.id} className="relative flex gap-4 items-center relative w-full">
						<a href={externalLink.url} target="_blank" rel="noreferrer" className="flex gap-4 items-center full">
							{externalLink.logoWhite && externalLink.logoBlack ? (
								<div className="dark:hidden">
									<Image src={`/img/${externalLink.logoBlack}`} alt={externalLink.title} width={16} height={16} />
								</div>
							) : <Factory className="w-4 h-4" />}
							{externalLink.logoWhite && externalLink.logoBlack && (
								<div className="hidden dark:block">
									<Image src={`/img/${externalLink.logoWhite}`} alt={externalLink.title} width={16} height={16} />
								</div>
							)}
							{externalLink.title}
							<MoveUpRight className="absolute right-0 w-4 h-4" />
						</a>
						{isAdmin && (
							<DeleteConfirmationPopover entity="External link" id={externalLink.id} className="absolute right-0" deleteAction={deleteExternalLink} />
						)}
					</NavigationMenuItem>
				))}
			</div>
		)}
		{isAdmin && (
			<ExternalLinkAddDialog />
		)}
	</>
}
