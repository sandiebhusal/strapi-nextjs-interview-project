import client from "../lib/apolloClient";
import { gql } from "@apollo/client";
import Pagination from "../components/Pagination";
import Filter from "../components/Filter";
import Link from "next/link";

const VIDEOS_QUERY = gql`
  query($start: Int, $limit: Int, $search: String) {
    videos(
      pagination: { start: $start, limit: $limit }
      filters: { title: { containsi: $search } }
    ) {
      data {
        id
        attributes {
          title
          slug
          video_url
          published_date
          duration
        }
      }
      meta {
        pagination {
          total
        }
      }
    }
  }
`;

const LIMIT = 4;

export default async function VideosPage({ searchParams }) {
  const currentPage = parseInt(searchParams.page) || 1;
  const search = searchParams.search || "";
  const start = (currentPage - 1) * LIMIT;

  let data = null;
  let error = null;

  try {
    const result = await client.query({
      query: VIDEOS_QUERY,
      variables: { start, limit: LIMIT, search },
    });
    data = result.data;
  } catch (err) {
    console.error("Apollo Client Error:", err);
    error = err.message;
  }

  const totalItems = data?.videos?.meta?.pagination?.total || 0;
  const totalPages = Math.ceil(totalItems / LIMIT);

  return (
    <div className="container">
      <h1>Videos</h1>
      <Filter initialSearch={search} />
      {error && <p>Error: {error}</p>}
      <div className="row">
        {data &&
          data.videos.data.map((video) => (
            <div className="col-12 col-md-6 mb-5" key={video.id}>
              <div className="img_card shadow-sm border-light">
                <div className="video-card">
                  <iframe
                    src={video.attributes.video_url}
                    className="video-iframe"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="YouTube video"
                  />
                </div>
                <Link
                  style={{ textDecoration: "none", color: "black" }}
                  href={`/videos/${video.attributes.slug}`}
                  passHref
                >
                  <h2 className="card-title p-3">{video.attributes.title}</h2>
                  <p className="card-text px-3">
                      <strong>Duration:</strong> {video.attributes.duration}{" "}
                      minutes
                    </p>
                  <p className="card-text text-muted px-3 mb-3">
                    {new Date(
                      video.attributes.published_date
                    ).toLocaleDateString()}
                  </p>
                </Link>
              </div>
            </div>
          ))}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} path="videos"/>
    </div>
  );
}
