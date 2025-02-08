import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupAction,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Import, Plus } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { redirect } from "next/navigation"
import { ReactElement } from "react"

function ImportFromUrlDialog({ children }: { children: ReactElement }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Import Tests</DialogTitle>
                    <DialogDescription>
                        Import Tests from open-api file URL
                    </DialogDescription>
                </DialogHeader>
                <form className="flex items-center space-x-2" action={async (formdata) => {
                    "use server";
                    const url = formdata.get("url_inp")?.toString() || "Bruh"
                    redirect(`/tests/${encodeURIComponent(url)}`)
                }}>
                    <div className="grid flex-1 gap-2">
                        <Input type="text" placeholder="URL" name="url_inp" />
                    </div>
                    <Button type="submit" size="sm" className="px-3">
                        <h3 className="font-semibold">Import</h3>
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarHeader>
                <div className="flex align-middle justify-center">
                    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                        Ok API
                    </h3>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Tests</SidebarGroupLabel>
                    <SidebarGroupAction>
                        <Plus /> <span className="sr-only">Add Test</span>
                    </SidebarGroupAction>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <ImportFromUrlDialog>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <div className="cursor-pointer">
                                            <Import />
                                            Import from URL
                                        </div>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </ImportFromUrlDialog>
                        </SidebarMenu>

                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup />
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}
