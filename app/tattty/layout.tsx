import { AppSidebar } from "@/components/app-sidebar";
import { SelectionProvider } from "@/components/providers/selection-provider";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<SidebarProvider
			style={
				{
					"--sidebar-width": "calc(var(--spacing) * 72)",
					"--header-height": "calc(var(--spacing) * 16)",
				} as React.CSSProperties
			}
		>
			<AppSidebar variant="inset" />
			<SidebarInset>
				<SelectionProvider>
					<SiteHeader />
					{children}
				</SelectionProvider>
			</SidebarInset>
		</SidebarProvider>
	);
}
