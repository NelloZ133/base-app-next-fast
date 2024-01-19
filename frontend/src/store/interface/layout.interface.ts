export interface ILayoutState {
  isLoading: boolean;
  isFetched: boolean;
  headerTitle: string;
  backable: boolean;
  backTarget: string | undefined;

  setIsLoading: (isLoading: boolean) => void;
  setIsFetched: (isFetched: boolean) => void;
  setHeaderTitle: (headerTitle: string) => void;
  setBackable: (backable: boolean) => void;
  setBackTarget: (backTarget: string | undefined) => void;
}
