import axios from "axios";

export default async function request<T>({
    path,
    method,
    authToken,
    body,
}: {
    path: string;
    method: "GET" | "POST" | "PUT" | "DELETE";
    authToken: string;
    body?: any;
}): Promise<T> {
    const { data } = await axios({
        url: path,
        method,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
        },
        data: body,
    });
    return data;
}
