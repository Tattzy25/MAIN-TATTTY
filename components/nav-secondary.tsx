"use client";

import type { Icon } from "@tabler/icons-react";
import type * as React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";

export function NavSecondary({
	items,
	...props
}: {
	items: {
		title: string;
		url: string;
		icon: Icon;
	}[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
	const { setOpenMobile, isMobile } = useSidebar();
	const pathname = usePathname();

	return (
		<SidebarGroup {...props}>
			<SidebarGroupContent>
				<SidebarMenu>
					{items.map((item) => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton 
								asChild
								isActive={pathname === item.url}
							>
								<Link 
									href={item.url}
									onClick={() => isMobile && setOpenMobile(false)}
								>
									<item.icon />
									<span>{item.title}</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
