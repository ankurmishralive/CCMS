const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

const buildUrl = (url, params) => {
  if (!API_BASE_URL && !params) {
    return url;
  }

  const requestUrl = new URL(
    url,
    API_BASE_URL || window.location.origin
  );

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        requestUrl.searchParams.set(key, value);
      }
    });
  }

  return API_BASE_URL || params ? requestUrl.toString() : url;
};

const getResponseData = async (response) => {
  const contentType = response.headers.get("content-type") || "";
  const responseText = await response.text();
  let responseData = responseText;

  if (contentType.includes("application/json") && responseText) {
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = responseText;
    }
  }

  if (!response.ok) {
    const message =
      typeof responseData === "object" && responseData?.message
        ? responseData.message
        : `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return responseData;
};

const request = async (url, { method = "GET", params, data, headers = {}, ...options } = {}) => {
  const requestHeaders = {
    Accept: "application/json",
    ...headers,
  };

  const requestOptions = {
    method,
    headers: requestHeaders,
    ...options,
  };

  if (data !== undefined && data !== null) {
    requestHeaders["Content-Type"] = "application/json";
    requestOptions.body = JSON.stringify(data);
  }

  const response = await fetch(buildUrl(url, params), requestOptions);

  if (response.status === 204) {
    return null;
  }

  return getResponseData(response);
};

const api = {
  get: (url, options = {}) => request(url, { ...options, method: "GET" }),
  post: (url, data, options = {}) => request(url, { ...options, data, method: "POST" }),
  put: (url, data, options = {}) => request(url, { ...options, data, method: "PUT" }),
  delete: (url, options = {}) => request(url, { ...options, method: "DELETE" }),
};

export { request };
export default api;