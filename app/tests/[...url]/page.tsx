import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import LocalTest, { RequestMethod } from "./localTest";

function TagItem({ current, methods, url }: { current: string, methods: object, url: string }) {
    return (
        <Accordion type="multiple">
            <AccordionItem value={`item-${current}`}>
                <AccordionTrigger>{current}</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-2">
                    {Object.entries(methods).map(([method, detail]: [string, { description: string }]) =>
                        <LocalTest
                            title={method}
                            key={method}
                            url={url}
                            method={method as RequestMethod}
                            description={detail.description} />
                    )}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )

}

interface OpenApi {
    servers: { url: string }[];
    info: {
        title: string;
        version: string;
    };
    paths: [string: object]
}

export default async function TestUrlPage({ params: { url } }: { params: { url: string } }) {
    const resp = await fetch(decodeURIComponent(url));
    const data: OpenApi = await resp.json();
    return (
        <>
            <div className="flex flex-row justify-between">
                <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight">{data.info.title}</h1>
                <Select defaultValue={data.servers[0].url}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Server" />
                    </SelectTrigger>
                    <SelectContent>
                        {data.servers.map((server: { url: string }, i) =>
                            <SelectItem key={i} value={server.url}>{server.url}</SelectItem>
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