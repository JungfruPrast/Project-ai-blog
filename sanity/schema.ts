import { type SchemaTypeDefinition } from 'sanity'
import { post } from './schemas/post'
import { tag } from './schemas/tag'
import { about } from './schemas/about'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [post, tag, about],
}

