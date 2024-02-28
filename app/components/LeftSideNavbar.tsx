import Link from "next/link";
// Assuming SEODocument type/interface is defined elsewhere
export interface SEODocument {
  title: string;
  slug: { current: string; };
}

 interface LeftSideNavbarProps {
  seoDocuments: SEODocument[];
}

const LeftSideNavbar: React.FC<LeftSideNavbarProps> = ({ seoDocuments }) => {
  return (
    <nav>
      {seoDocuments.map((doc, index) => (
        <div key={index} className="mb-2">
          <Link href={`/seodocuments/${doc.slug}`}>
            <div className="block p-2 rounded hover:font-semibold">
              {doc.title}
            </div>
          </Link>
        </div>
      ))}
    </nav>
  );
};

export default LeftSideNavbar;
