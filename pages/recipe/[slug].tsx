import { GraphQLClient } from 'graphql-request'
import Link from 'next/link'
import {
  Box,
  Canvas,
  Card,
  Center,
  Button,
  Flex,
  Grid,
  Stack,
  Text,
  Image,
} from '@xooom/ui'
import { FaCarrot } from 'react-icons/fa'
import { GrGroup } from 'react-icons/gr'
import { IoToday } from 'react-icons/io5'

const graphcms = new GraphQLClient(process.env.GRAPHQL_URL_ENDPOINT!)

export async function getStaticProps({ params }) {
  const { recipe } = await graphcms.request(
    `
    query Recipe($slug: String!) {
      recipe(where: {slug: $slug}) {
        id
        title
        slug
        ingredients { 
          html 
        }
        howTo { 
          html 
        }
        notes { 
          html 
        }
        persons
        days
        vegetarian
      }
    }
    `,
    {
      slug: params.slug,
    }
  )

  return {
    props: {
      recipe,
    },
  }
}

export async function getStaticPaths() {
  const { recipes } = await graphcms.request(`
  {
    recipes {
      id
      title
      slug
      ingredients { 
        html 
      }
      howTo { 
        html 
      }
      notes { 
        html 
      }
      persons
      days
      vegetarian
    }
  }`)

  return {
    paths: recipes.map(({ slug }) => ({
      params: { slug },
    })),
    fallback: false,
  }
}

export default function renderRecipe({ recipe }) {
  return (
    <Canvas padding='lg'>
      <Center>
        <Link href='/'>
          <Button css={{ marginBottom: '20px' }}>
            Tilbage til alle opskrifter
          </Button>
        </Link>
        <Card padding='md'>
          <Flex css={{ jc: 'space-between' }}>
            <Stack gap='md'>
              <Text
                as='h2'
                weight={700}
                size={7}
                // css={{
                //   marginBottom: '30px',
                // }}
              >
                {recipe.title}
              </Text>
              <Box>
                <Text
                  as='h3'
                  weight={700}
                  size={5}
                  css={{
                    marginBottom: '30px',
                  }}
                >
                  Ingredienser
                </Text>
                <p
                  dangerouslySetInnerHTML={{ __html: recipe.ingredients.html }}
                ></p>
              </Box>
              <Box>
                <Text
                  as='h3'
                  weight={700}
                  size={5}
                  css={{
                    marginBottom: '30px',
                  }}
                >
                  Sådan gør du
                </Text>
                <p dangerouslySetInnerHTML={{ __html: recipe.howTo.html }}></p>
              </Box>
              {recipe.notes && (
                <Box>
                  <Text
                    as='h3'
                    weight={700}
                    size={5}
                    css={{
                      marginBottom: '30px',
                    }}
                  >
                    Noter
                  </Text>
                  <p
                    dangerouslySetInnerHTML={{ __html: recipe.notes.html }}
                  ></p>
                </Box>
              )}
            </Stack>
            <Stack direction='row' css={{ ai: 'center', paddingLeft: '20px' }}>
              <Stack
                padding='sm'
                css={{
                  opacity: '0.5',
                  color: 'orange',
                  fontSize: '2rem',
                }}
              >
                {recipe.vegetarian && <FaCarrot />}
              </Stack>
              <Stack padding='sm'>
                <IoToday />
                <Text
                  as='h3'
                  weight={700}
                  size={7}
                  css={{ textAlign: 'center', paddingTop: '10px' }}
                >
                  {recipe.days}
                </Text>
              </Stack>
              <Stack padding='sm'>
                <GrGroup />
                <Text
                  as='h3'
                  weight={700}
                  size={7}
                  css={{ textAlign: 'center', paddingTop: '10px' }}
                >
                  {recipe.persons}
                </Text>
              </Stack>
            </Stack>
          </Flex>
        </Card>
      </Center>
    </Canvas>
  )
}
