import { new_test } from "@/app/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { redirect } from "next/navigation";

export default async function NewTest() {

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Create a new server-side test
                </CardTitle>
            </CardHeader>

            <CardContent>
                <form className="flex gap-3 flex-col" action={async (formdata) => {
                    "use server";

                    let testName = formdata.get("test_name")?.toString() || "";
                    const fileUrl = formdata.get("file_url")?.toString() || "";
                    const token = formdata.get("token")?.toString() || "";
                    const altUrl = formdata.get("alt")?.toString() || "";

                    if (testName === "") {

                        let randomName = "";
                        for (let i = 0; i <= 6; i++) {
                            randomName +=
                                String.fromCharCode(Math.floor(Math.random() * (122 - 97) + 97));
                        }
                        testName = randomName;
                    }

                    await new_test(testName, { auth: token, name: testName, open_api_file_url: fileUrl, alternative_api_url: altUrl })

                    redirect(`/tests/server/${testName}`)
                }
                }>
                    <Input placeholder="Test name" name="test_name" />
                    <Input placeholder="open-api.json file URL" name="file_url" />
                    <Input placeholder="Auth token" name="token" />
                    <Input placeholder="Alternative API server url (optional)" name="alt" />

                    <Button>
                        Create
                    </Button>
                </form>
            </CardContent>
        </Card >
    )

}