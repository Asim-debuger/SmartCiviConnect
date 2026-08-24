const API = "http://localhost:5000/api";
const PASSWORD = "QaScc2026!";

async function req(method, path, { token, body } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API}${path}`, { method, headers, body: body !== undefined ? JSON.stringify(body) : undefined });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = { raw: text.slice(0, 300) }; }
  return { status: res.status, data };
}

async function login(email) {
  const { status, data } = await req("POST", "/auth/login", { body: { email, password: PASSWORD } });
  if (status !== 200) throw new Error(`login ${email} ${status}`);
  return { token: data.accessToken, user: data.user };
}

function log(name, ok, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${detail ? ` — ${detail}` : ""}`);
  return ok;
}

async function main() {
  const results = [];
  const citizen = await login("qa.citizen.scc@example.com");
  const officer = await login("qa.officer.scc@example.com");

  const created = await req("POST", "/feed", {
    token: citizen.token,
    body: {
      body: "QA original post with mixed media",
      kind: "Community Update",
      media: [
        { url: "https://res.cloudinary.com/demo/image/upload/sample.jpg", resourceType: "image", name: "sample.jpg" },
        { url: "https://res.cloudinary.com/demo/video/upload/dog.mp4", resourceType: "video", name: "dog.mp4" },
        { url: "https://res.cloudinary.com/demo/raw/upload/brief.pdf", resourceType: "raw", name: "brief.pdf" },
      ],
    },
  });
  const original = created.data.post;
  results.push(log("create original with media", created.status === 201 && original?.media?.length === 3, String(created.status)));

  const share = await req("POST", `/feed/${original._id}/share`, { token: officer.token, body: { body: "Adding my note on this update" } });
  const repost = share.data.post;
  results.push(log("repost stores reference not media copy", share.status === 200 && String(repost?.sharedFrom?._id || repost?.sharedFrom) === String(original._id) && (repost.media || []).length === 0, `media=${(repost?.media || []).length}`));
  results.push(log("repost keeps original author and media", Boolean(repost?.sharedFrom?.author?.name) && (repost?.sharedFrom?.media || []).length === 3, `origMedia=${(repost?.sharedFrom?.media || []).length}`));
  results.push(log("repost is flagged", Boolean(repost?.isRepost || repost?.sharedFrom)));

  const like = await req("POST", `/feed/${repost._id}/like`, { token: citizen.token });
  results.push(log("like on repost", like.status === 200 && like.data.likes >= 1));

  const comment = await req("POST", `/feed/${repost._id}/comment`, { token: citizen.token, body: { body: "Comment on the repost" } });
  results.push(log("comment on repost", comment.status === 200));

  const save = await req("POST", `/feed/${repost._id}/save`, { token: citizen.token });
  results.push(log("save repost", save.status === 200 && save.data.saved === true));

  const nested = await req("POST", `/feed/${repost._id}/share`, { token: citizen.token, body: { body: "" } });
  const nestedId = nested.data.post?.sharedFrom?._id || nested.data.post?.sharedFrom;
  results.push(log("share of repost still points at original", nested.status === 200 && String(nestedId) === String(original._id)));

  const publicPost = await req("GET", `/public/posts/${repost._id}`);
  results.push(log("public view of repost includes original media", publicPost.status === 200 && (publicPost.data.post?.sharedFrom?.media || []).length === 3));

  const del = await req("DELETE", `/feed/${repost._id}`, { token: officer.token });
  results.push(log("author can delete repost", del.status === 200));

  const still = await req("GET", `/public/posts/${original._id}`);
  results.push(log("deleting repost keeps original", still.status === 200 && still.data.post?.body?.includes("QA original")));

  const stolen = await req("DELETE", `/feed/${original._id}`, { token: officer.token });
  results.push(log("other user cannot delete original", stolen.status === 403));

  const citizenPay = await req("GET", "/payments", { token: citizen.token });
  results.push(log("citizen still blocked from payments", citizenPay.status === 403));

  const citizenBank = await req("GET", "/users/me/payment-profile", { token: citizen.token });
  results.push(log("citizen still blocked from bank profile", citizenBank.status === 403));

  const failed = results.filter((ok) => !ok).length;
  console.log(JSON.stringify({ passed: results.length - failed, failed }));
  process.exit(failed ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
