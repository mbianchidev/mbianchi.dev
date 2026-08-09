export interface GeneratedBlogSocialImage {
  src: string
  width: number
  height: number
  type: string
}

export const generatedDirectory: string
export const generatedManifestPath: string
export const publicDirectory: string

export function isPublishedBlogPostFile(fileName: string): boolean
export function isLocalBlogImageReference(value: unknown): value is string
export function isPublicBlogImageReference(value: unknown): value is string
export function resolveLocalBlogImage(postFile: string, imageReference: string): string
export function getBlogSocialImageOutput(
  slug: string,
  sourcePath: string
): {
  destinationPath: string
  publicPath: string
}
export function getGeneratedBlogSocialImage(slug: string): GeneratedBlogSocialImage
