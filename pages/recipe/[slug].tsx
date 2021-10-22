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
  AspectRatio,
} from '@xooom/ui'
import { FaCarrot } from 'react-icons/fa'
import { GrGroup } from 'react-icons/gr'
import { IoToday } from 'react-icons/io5'
import { IconContext } from 'react-icons'
import { BiCameraOff } from 'react-icons/bi'

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
        image {
          url
        }
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
  const imageExists = recipe?.image?.url
  return (
    <>
      <Box
        css={{
          width: '100vw',
          height: '400px',
          position: 'absolute',
          //backgroundColor: '$gray4',
          ai: 'center',
          jc: 'center',
          display: 'flex',
        }}
      >
        {imageExists ? (
          <AspectRatio ratio={16 / 9}>
            <Image alt={`Image of ${recipe?.title}`} src={recipe?.image?.url} />
            <Box
              css={{
                position: 'absolute',
                background: 'linear-gradient(transparent, $gray3)',
                height: '100px',
                width: '100%',
                bottom: '0',
              }}
            />
          </AspectRatio>
        ) : (
          ''
        )}
      </Box>
      {/* size={{ '@initial': '2', '@bp1': '5' }} */}
      <Canvas padding={{ '@initial': 'sm', '@bp1': 'lg' }}>
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
                  size={{ '@initial': '5', '@bp1': '7' }}
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
                    size={{ '@initial': 2, '@bp1': 6 }}
                    css={{
                      marginBottom: '30px',
                    }}
                  >
                    Ingredienser
                  </Text>
                </Box>
                <Box>
                  <Text
                    as='h3'
                    weight={700}
                    size={{ '@initial': 2, '@bp1': 5 }}
                    css={{
                      marginBottom: '30px',
                    }}
                  >
                    Sådan gør du
                  </Text>
                  <div
                    dangerouslySetInnerHTML={{ __html: recipe.howTo.html }}
                  />
                </Box>
                {recipe.notes && (
                  <Box>
                    <Text
                      as='h3'
                      weight={700}
                      size={{ '@initial': '3', '@bp1': '5' }}
                      css={{
                        marginBottom: '30px',
                      }}
                    >
                      Noter
                    </Text>
                    <div
                      dangerouslySetInnerHTML={{ __html: recipe.notes.html }}
                    />
                  </Box>
                )}
              </Stack>
              <Stack
                direction='row'
                css={{ ai: 'center', paddingLeft: '20px' }}
              >
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
    </>
  )
}
