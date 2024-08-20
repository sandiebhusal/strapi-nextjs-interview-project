import client from "../../lib/apolloClient";
import { gql } from "@apollo/client";

const BLOG_QUERY = gql`
  query Blogs($slug: String!) {
    blogs(filters: { slug: { eq: $slug } }) {
      data {
        id
        attributes {
          title
          slug
          img_url
          published_date
          read_time
          body
        }
      }
    }
  }
`;

export async function generateStaticParams() {
  const QUERY = gql`
    query {
      blogs {
        data {
          attributes {
            slug
          }
        }
      }
    }
  `;

  const { data } = await client.query({ query: QUERY });

  return data.blogs.data.map((blog) => ({
    slug: blog.attributes.slug,
  }));
}

export default async function BlogPage({ params }) {
  const { slug } = params;

  const { data } = await client.query({
    query: BLOG_QUERY,
    variables: { slug },
  });

  const [blog] = data?.blogs?.data;

  if (!blog) {
    return <div>Blog not found</div>;
  }

  const { title, img_url, published_date, read_time, body } =
    blog?.attributes;

    const [paragraph] = body

    const [description] = paragraph.children

  return (
    <div className="container">
      <article>
        <header>
          <h1>{title}</h1>
          <img className="img-fluid rounded mb-4" src={img_url} alt={title} />
          <p className="text-muted">
            Published on: {new Date(published_date).toLocaleDateString()}
          </p>
          <p className="text-muted">Read Time: {read_time} minutes</p>
        </header>
        <section dangerouslySetInnerHTML={{ __html: description.text }} />
      </article>
    </div>
  );
}
