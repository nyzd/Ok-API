"use client";
import { LocalTestInfo, ResponseError } from "@/app/lib/test";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";


export default function LocalTest(info: LocalTestInfo) {
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);
    const [body, setBody] = useState<string>("");
    const [response, setResponse] = useState<object | null>(null);
    const [error, setError] = useState<ResponseError | null>(null);

    const onClick = async () => {
        setButtonLoading(true);
        const resp = await fetch(info.url, {
            method: info.method,
            headers: info.method !== "get" ? {
                "Content-Type": "application/json"
            } : {},
            body: info.method !== "get" ? body : null
        });
        if (resp.status !== 200) {
            setError({
                status: resp.status,
                message: await resp.text()
            });
            setButtonLoading(false);
            return;
        }
        const data = await resp.json();
        setResponse(data);
        setButtonLoading(false)
    }

    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setBody(e.target.value);
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <Badge>{info.title}</Badge>
                </CardTitle>
                <CardDescription>
                    <p>{info.description}</p>
                </CardDescription>
            </CardHeader>
            <CardContent>
                {
                    info.method === "get" ? "" :
                        <Textarea placeholder="Request Body" onChange={onChange} />
                }
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-5">
                <Button disabled={buttonLoading} onClick={onClick} variant={"outline"}>
                    {
                        buttonLoading && <Loader2 className="animate-spin" />
                    }
                    Local Test
                </Button>
                {response && <p>{JSON.stringify(response)}</p>}
                {error &&
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle><Badge variant={"destructive"}>{error.status}</Badge></AlertTitle>
                        <AlertDescription>
                            {error.message}
                        </AlertDescription>
                    </Alert>
                }
            </CardFooter>
        </Card>
    )

}