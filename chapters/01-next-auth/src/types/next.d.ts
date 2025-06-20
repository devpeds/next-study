declare module globalThis {
  type PageParamsBase = Record<string, string>;
  type PageSearchParamsBase = Record<string, string | string[] | undefined>;

  type PageRouteParams<P extends PageParamsBase> = {
    params: Promise<P>;
  };

  type PageQueryParams<S extends PageSearchParamsBase> = {
    searchParams: Promise<S>;
  };

  type PageProps<
    P extends PageParamsBase,
    S extends PageSearchParamsBase
  > = PageRouteParams<P> & PageQueryParams<S>;
}
