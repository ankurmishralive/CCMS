import { useCallback, useState } from "react";
import api from "../api/api";

function withApi(WrappedComponent) {
  function WithApi(props) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const execute = useCallback(async (apiRequest) => {
      setLoading(true);
      setError(null);

      try {
        const responseData = await apiRequest();
        setData(responseData);
        return responseData;
      } catch (requestError) {
        setError(requestError);
        throw requestError;
      } finally {
        setLoading(false);
      }
    }, []);

    const getApiData = useCallback(
      (url, options = {}) => execute(() => api.get(url, options)),
      [execute]
    );

    const postApiData = useCallback(
      (url, requestData, options = {}) => execute(() => api.post(url, requestData, options)),
      [execute]
    );

    const putApiData = useCallback(
      (url, requestData, options = {}) => execute(() => api.put(url, requestData, options)),
      [execute]
    );

    const deleteApiData = useCallback(
      (url, options = {}) => execute(() => api.delete(url, options)),
      [execute]
    );

    return (
      <WrappedComponent
        {...props}
        apiData={data}
        apiLoading={loading}
        apiError={error}
        getApiData={getApiData}
        postApiData={postApiData}
        putApiData={putApiData}
        deleteApiData={deleteApiData}
      />
    );
  }

  WithApi.displayName = `withApi(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

  return WithApi;
}

export default withApi;