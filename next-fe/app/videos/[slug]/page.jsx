import client from "../../lib/apolloClient";
import { gql } from "@apollo/client";

const VIDEO_QUERY = gql`
  query Videos($slug: String!) {
    videos(filters: { slug: { eq: $slug } }) {
      data {
        id
        attributes {
          title
          video_url
          published_date
          video_description
          duration
        }
      }
    }
  }
`;

export async function generateStaticParams() {
  const QUERY = gql`
    query {
      videos {
        data {
          attributes {
            slug
          }
        }
      }
    }
  `;

  const { data } = await client.query({ query: QUERY });

  return data.videos.data.map((video) => ({
    slug: video.attributes.slug,
  }));
}

export default async function VideoPage({ params }) {
  const { slug } = params;

  const { data } = await client.query({
    query: VIDEO_QUERY,
    variables: { slug },
  });

  const [video] = data?.videos?.data;

  if (!video) {
    return <div>Video not found</div>;
  }

  const { title, video_url, published_date, video_description, duration } =
    video.attributes;

  return (
    <div className="container">
      <article>
        <header>
          <h1>{title}</h1>
          <div className="videoContainer">
            <iframe
              src={video_url}
              className="videoIframe"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={title}
            />
          </div>
          <p className="text-muted mt-3">
            Published on: {new Date(published_date).toLocaleDateString()}
          </p>
          <p className="card-text">
                      <strong>Duration:</strong> {duration}{" "}
                      minutes
                    </p>
        </header>
        <section dangerouslySetInnerHTML={{ __html: video_description }} />
      </article>
    </div>
  );
}
