import CMSNavbar from "../components/CMSNavbar";
import Provider from "../utils.tsx/Provider";
import { headers } from "next/headers";

export const metadata = {
  title: 'Project AI Blog',
  description: 'Documenting my AI blogging Journey with ChatGPT4: From A to Z ',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Move the nonce retrieval inside the component where the headers() function has access to the request context
  const nonce = headers().get('x-nonce') || "";

  return (
    <html lang="en">
      <body>
        <Provider nonce={nonce}>
          <CMSNavbar/>
          {children}
        </Provider>
      </body>
    </html>
  );
}
