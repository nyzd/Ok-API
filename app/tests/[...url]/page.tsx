import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import LocalTest from "./localTest";

function TagItem({ current, methods, url }: { current: string, methods: any, url: string }) {
    return (
        <Accordion type="multiple">
            <AccordionItem value={`item-${current}`}>
                <AccordionTrigger>{current}</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-2">
                    {Object.entries(methods).map(([method, detail]: [string, any]) =>
                        <LocalTest
                            title={method}
                            key={method}
                            url={url}
                            method={method as any}
                            description={detail.description} />
                    )}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )

}

export default async function TestUrlPage({ params: { url } }: { params: { url: string } }) {
    const resp = await fetch(decodeURIComponent(url));
    const data: any = await resp.json();
    return (
        <>
            <div className="flex flex-row justify-between">
                <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight">{data.info.title}</h1>
                <Select defaultValue={data.servers[0].url}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Server" />
                    </SelectTrigger>
                    <SelectContent>
                        {data.servers.map((server: { url: string }) =>
                            <SelectItem value={server.url}>{server.url}</SelectItem>
                        )}
                    </SelectContent>
                </Select>
            </div>
            {
                <div className="p-6">
                    {
                        Object.entries(data.paths)
                            .map(
                                ([route, methods], i) =>
                                    // TODO: fix Static url
                                    <TagItem key={i} url={data.servers[0].url + route} current={route} methods={methods} />
                            )
                    }
                </div>
            }
        </>
    )
}