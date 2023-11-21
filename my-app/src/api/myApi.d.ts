/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface EmailData {
  subject?: string | null;
  body?: string | null;
  attachmentPath?: string | null;
}
/** @format int32 */
export declare enum FileType {
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
}
export interface FileUploadModel {
  /** @format binary */
  fileDetails?: File | null;
  fileType?: FileType;
}
export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;
export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}
export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;
export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}
export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}
type CancelToken = Symbol | string | number;
export declare enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}
export declare class HttpClient<SecurityDataType = unknown> {
  baseUrl: string;
  private securityData;
  private securityWorker?;
  private abortControllers;
  private customFetch;
  private baseApiParams;
  constructor(apiConfig?: ApiConfig<SecurityDataType>);
  setSecurityData: (data: SecurityDataType | null) => void;
  protected encodeQueryParam(key: string, value: any): string;
  protected addQueryParam(query: QueryParamsType, key: string): string;
  protected addArrayQueryParam(query: QueryParamsType, key: string): any;
  protected toQueryString(rawQuery?: QueryParamsType): string;
  protected addQueryParams(rawQuery?: QueryParamsType): string;
  private contentFormatters;
  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams;
  protected createAbortSignal: (cancelToken: CancelToken) => AbortSignal | undefined;
  abortRequest: (cancelToken: CancelToken) => void;
  request: <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams) => Promise<HttpResponse<T, E>>;
}
/**
 * @title resarchteam
 * @version 1.0
 */
export declare class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  api: {
    /**
     * No description
     *
     * @tags Email
     * @name EmailCreate
     * @request POST:/api/Email
     */
    emailCreate: (data: EmailData, params?: RequestParams) => Promise<HttpResponse<void, any>>;
  };
  postSingleFile: {
    /**
     * No description
     *
     * @tags Files
     * @name PostSingleFileCreate
     * @request POST:/PostSingleFile
     */
    postSingleFileCreate: (
      data: {
        /** @format binary */
        FileDetails?: File;
        FileType?: FileType;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<void, any>>;
  };
  postMultipleFile: {
    /**
     * No description
     *
     * @tags Files
     * @name PostMultipleFileCreate
     * @request POST:/PostMultipleFile
     */
    postMultipleFileCreate: (
      data: {
        fileDetails?: FileUploadModel[];
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<void, any>>;
  };
  downloadFile: {
    /**
     * No description
     *
     * @tags Files
     * @name DownloadFileList
     * @request GET:/DownloadFile
     */
    downloadFileList: (
      query?: {
        /** @format int32 */
        id?: number;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<void, any>>;
  };
  downloadFileByName: {
    /**
     * No description
     *
     * @tags Files
     * @name DownloadFileByNameList
     * @request GET:/DownloadFileByName
     */
    downloadFileByNameList: (
      query?: {
        Name?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<void, any>>;
  };
  showAllFiles: {
    /**
     * No description
     *
     * @tags Files
     * @name ShowAllFilesList
     * @request GET:/ShowAllFiles
     */
    showAllFilesList: (params?: RequestParams) => Promise<HttpResponse<void, any>>;
  };
}
export {};
