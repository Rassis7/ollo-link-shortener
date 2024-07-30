import { supabaseClient } from "../clients/supabase";

export interface SupabaseOptions {
  bucket: string;
  url: string;
  apiKey: string;
}

type UploadProps = {
  file: File | Blob | FormData;
  path: string;
  bucket?: CreateBucketProps;
};

type CreateBucketProps = {
  bucketName: string;
  allowedMimeTypes?: string[];
  fileSizeLimit?: number;
};

const defaultBucketName = String(process.env.SUPABASE_DEFAULT_BUCKET);

export class FileStorage {
  static async createBucket({
    bucketName,
    allowedMimeTypes = ["*"],
    fileSizeLimit = 1024,
  }: CreateBucketProps): Promise<string> {
    const { data, error } = await supabaseClient.storage.createBucket(
      bucketName,
      {
        public: false,
        allowedMimeTypes,
        fileSizeLimit,
      }
    );

    if (error) {
      throw new Error(error.message);
    }

    return data?.name;
  }

  static async upload({ file, path, bucket }: UploadProps) {
    let bucketName = defaultBucketName;
    if (bucket) {
      bucketName = await FileStorage.createBucket(bucket);
    }

    const { data, error } = await supabaseClient.storage
      .from(bucketName)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  static getPublicFileUrl(fullPath: string) {
    return `${process.env.SUPABASE_PUBLIC_URL}/${fullPath}`;
  }
}
