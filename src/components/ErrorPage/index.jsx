import { Link } from "react-router-dom";

function ErrorPage() {
  return (
    <div className="mt-10 text-center text-4xl font-bold">
      <p>404 Not Found!</p>
      <Link to="/">
        <div className="mt-4">Go Back To Main Page</div>
      </Link>
    </div>
  );
}

export default ErrorPage;
