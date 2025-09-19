export function ErrorFallBack({ error, resetErrorBoundary }) {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="m-auto w-1/2">
        <div className="flex flex-col items-center px-12">
          <img src="https://raw.githubusercontent.com/Tibex88/assets/refs/heads/main/alert.svg" className="mb-8 block h-72 dark:invert-[0.95]" />
          <h2 className="mb-2 text-3xl font-bold text-foreground/70">
            Something went wrong.
          </h2>
          <ol className="list-decimal text-foreground/50 text-center">
            <li> An error occured while trying to process your request. 
              Please try reloading the page</li>
            <li>
              If this doesn't work, please{" "}
              <a href="#" className="text-blue-500">
                contact us.
              </a>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}