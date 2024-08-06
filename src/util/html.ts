export async function get(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Fail to fetch data");

  const data = (await res.json()) as unknown;

  return data;
}

export async function post(url: string, payload: unknown) {
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error("Fail to post data");
}

export async function remove(url: string) {
  const res = await fetch(url, { method: "DELETE" });

  if (!res.ok) throw new Error("Fail to delete data");
}
