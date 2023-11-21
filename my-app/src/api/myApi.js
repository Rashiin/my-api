
/** @format int32 */
export var FileType;
(function (FileType) {
  FileType[(FileType["Value1"] = 1)] = "Value1";
  FileType[(FileType["Value2"] = 2)] = "Value2";
  FileType[(FileType["Value3"] = 3)] = "Value3";
})(FileType || (FileType = {}));
export var ContentType;
(function (ContentType) {
  ContentType["Json"] = "application/json";
  ContentType["FormData"] = "multipart/form-data";
  ContentType["UrlEncoded"] = "application/x-www-form-urlencoded";
  ContentType["Text"] = "text/plain";
})(ContentType || (ContentType = {}));
export class HttpClient {
  baseUrl = "";
  securityData = null;
  securityWorker;
  abortControllers = new Map();
  customFetch = (...fetchParams) => fetch(...fetchParams);
  baseApiParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };
  constructor(apiConfig = {}) {
    Object.assign(this, apiConfig);
  }
  setSecurityData = (data) => {
    this.securityData = data;
  };
  encodeQueryParam(key, value) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }
  addQueryParam(query, key) {
    return this.encodeQueryParam(key, query[key]);
  }
  addArrayQueryParam(query, key) {
    const value = query[key];
    return value.map((v) => this.encodeQueryParam(key, v)).join("&");
  }
  toQueryString(rawQuery) {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join("&");
  }
  addQueryParams(rawQuery) {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }
  contentFormatters = {
    [ContentType.Json]: (input) =>
      input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
    [ContentType.Text]: (input) => (input !== null && typeof input !== "string" ? JSON.stringify(input) : input),
    [ContentType.FormData]: (input) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
            ? JSON.stringify(property)
            : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input) => this.toQueryString(input),
  };
  mergeRequestParams(params1, params2) {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }
  createAbortSignal = (cancelToken) => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }
    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };
  abortRequest = (cancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);
    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };
  request = async ({ body, secure, path, type, query, format, baseUrl, cancelToken, ...params }) => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;
    return this.customFetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
      },
      signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
      body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response;
      r.data = null;
      r.error = null;
      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });
      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }
      if (!response.ok) throw data;
      return data;
    });
  };
}
/**
 * @title resarchteam
 * @version 1.0
 */
export class Api extends HttpClient {
  api = {
    /**
     * No description
     *
     * @tags Email
     * @name EmailCreate
     * @request POST:/api/Email
     */
    emailCreate: (data, params = {}) =>
      this.request({
        path: `/api/Email`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),
  };
  postSingleFile = {
    /**
     * No description
     *
     * @tags Files
     * @name PostSingleFileCreate
     * @request POST:/PostSingleFile
     */
    postSingleFileCreate: (data, params = {}) =>
      this.request({
        path: `/PostSingleFile`,
        method: "POST",
        body: data,
        type: ContentType.FormData,
        ...params,
      }),
  };
  postMultipleFile = {
    /**
     * No description
     *
     * @tags Files
     * @name PostMultipleFileCreate
     * @request POST:/PostMultipleFile
     */
    postMultipleFileCreate: (data, params = {}) =>
      this.request({
        path: `/PostMultipleFile`,
        method: "POST",
        body: data,
        type: ContentType.FormData,
        ...params,
      }),
  };
  downloadFile = {
    /**
     * No description
     *
     * @tags Files
     * @name DownloadFileList
     * @request GET:/DownloadFile
     */
    downloadFileList: (query, params = {}) =>
      this.request({
        path: `/DownloadFile`,
        method: "GET",
        query: query,
        ...params,
      }),
  };
  downloadFileByName = {
    /**
     * No description
     *
     * @tags Files
     * @name DownloadFileByNameList
     * @request GET:/DownloadFileByName
     */
    downloadFileByNameList: (query, params = {}) =>
      this.request({
        path: `/DownloadFileByName`,
        method: "GET",
        query: query,
        ...params,
      }),
  };
  showAllFiles = {
    /**
     * No description
     *
     * @tags Files
     * @name ShowAllFilesList
     * @request GET:/ShowAllFiles
     */
    showAllFilesList: (params = {}) =>
      this.request({
        path: `/ShowAllFiles`,
        method: "GET",
        ...params,
      }),
  };
}
