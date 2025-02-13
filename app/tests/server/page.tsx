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

                    if (testName === "") {
                        const randomName = [0, 0, 0, 0, 0, 0]
                            .map(_ => String.fromCharCode(Math.floor(Math.random() * (122 - 97) + 97)))
                            .join("")

                        testName = randomName;
                    }

                    await new_test(testName, { auth: token, name: testName, open_api_file_url: fileUrl })

                    redirect(`/tests/server/${testName}`)
                }}>
                    <Input placeholder="Test name" name="test_name" />
                    <Input placeholder="open-api.json file URL" name="file_url" />
                    <Input placeholder="Auth token" name="token" />

                    <Button>
                        Create
                    </Button>
                </form>
            </CardContent>
        </Card >
    )

}