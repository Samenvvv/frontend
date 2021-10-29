declare interface IHashtag extends LocalizedSlugs {
  __typename?: 'Hashtag'
  id: string
  created_at: string
  updated_at: string
  title: string
  slug: string
  content: string
  image?: IUploadFile
  date: string
  hashtag: string
  page?: IPage
  metadata?: IMetadata
  locale?: string
  published_at?: string
  posts?: Array<IHashtagPost>
  localizations?: Array<IHashtag>
}

declare interface IHashtagInput {
  title: string
  slug: string
  content: string
  image?: string
  date: string
  hashtag: string
  page?: string
  posts?: Array<string>
  metadata: IMetadata
  localizations?: Array<string>
  locale?: string
  published_at?: string
  created_by?: string
  updated_by?: string
}
