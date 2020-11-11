export default async function preview(req, res) {
  const { query } = req;
  const { to } = query;

  res.redirect(`/redirectTest/${to}`);
}
