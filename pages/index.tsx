import { GraphQLClient } from 'graphql-request'
import {
  Box,
  Canvas,
  Card,
  Center,
  Flex,
  Grid,
  Stack,
  Text,
  Image,
  Checkbox,
  AspectRatio,
  Button,
  Input,
} from '@xooom/ui'
import Link from 'next/link'
import NextImage from 'next/image'
import { FaCarrot } from 'react-icons/fa'
import { GrGroup } from 'react-icons/gr'
import { IoToday } from 'react-icons/io5'
import { BiCameraOff } from 'react-icons/bi'
import { useState } from 'react'
import { useMemo } from 'react'
import { useMediaQuery } from 'react-responsive/'
import { IconContext } from 'react-icons'

const graphcms = new GraphQLClient(process.env.GRAPHQL_URL_ENDPOINT!)

export async function getStaticProps() {
  const { recipes } = await graphcms.request(
    `
    query Posts() {
      recipes {
        id
        title
        slug
        days
        persons
        vegetarian
        image {
          url
        }
      }
    }
  `
  )

  return {
    props: {
      recipes,
    },
  }
}

export default function Recipes({ recipes }) {
  const [isVegetarian, setIsVegetarian] = useState(false)
  const [days, setDays] = useState('')
  const [search, setSearch] = useState('')
  const [resetVisible, setResetVisible] = useState(false)

  const recipesFiltered = useMemo(
    () =>
      recipes
        .filter((recipe) => {
          if (!isVegetarian) return true
          if (isVegetarian && recipe.vegetarian) return true
          return false
        })
        .filter((recipe) => {
          if (!days) return true
          if (recipe.days == Number(days)) return true
          return false
        })
        .filter((recipe) => {
          if (!search) return true
          if (recipe.title.toLowerCase().includes(search.toLowerCase()))
            return true
          return false
        }),
    [recipes, isVegetarian, days, search]
  )

  let randomRecipe =
    recipesFiltered[Math.floor(Math.random() * recipesFiltered.length)]

  return (
    <Canvas padding='lg'>
      <Stack css={{ maxWidth: '1000px', margin: 'auto' }}>
        <Box>
          <Box
            css={{ jc: 'space-between', ai: 'center', marginBottom: '20px' }}
          >
            <Text as='h1' weight={700} size={6}>
              Opskrifter til Vervuurt/Nielsen-husholdningen
            </Text>
          </Box>
          <Stack gap='md'>
            <Card padding='md'>
              <Flex css={{ ai: 'center', jc: 'space-between' }}>
                <Input
                  type='number'
                  label='Dage'
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  css={{}}
                />
                <Input
                  label='Navn'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Checkbox
                  label='Vegetarisk'
                  checked={isVegetarian}
                  onCheckedChange={() => setIsVegetarian(!isVegetarian)}
                ></Checkbox>
                {resetVisible || isVegetarian || days || search ? (
                  <Button
                    color='warning'
                    onClick={() => (
                      setIsVegetarian(false), setSearch(''), setDays('')
                    )}
                  >
                    Reset
                  </Button>
                ) : (
                  <Button color='warning' disabled>
                    Reset
                  </Button>
                )}
                <Link as={`/recipe/${randomRecipe?.slug}`} href='recipe/[slug]'>
                  <Button>Random</Button>
                </Link>
              </Flex>
            </Card>
            {recipesFiltered.map((recipe) => {
              const imageExists = recipe?.image?.url
              return (
                <Link
                  key={recipe?.id}
                  as={`/recipe/${recipe?.slug}`}
                  href='/recipe/[slug]'
                >
                  <Card css={{ overflow: 'hidden' }}>
                    <Flex
                      css={{
                        ai: 'center',
                        jc: 'space-between',
                        flexWrap: 'wrap',
                        '@bp2': { flexWrap: 'nowrap' },
                      }}
                    >
                      <Stack
                        direction='row'
                        css={{
                          flex: 1,
                          ai: 'center',
                          minWidth: '100%',
                          '@bp1': { width: 'auto' },
                        }}
                      >
                        <Box
                          css={{
                            width: '100px',
                            height: '100px',
                            marginRight: '20px',
                            backgroundColor: '$gray4',
                            ai: 'center',
                            jc: 'center',
                            display: 'flex',
                          }}
                        >
                          {imageExists ? (
                            <AspectRatio ratio={1}>
                              <Image
                                alt={`Image of ${recipe?.title}`}
                                src={recipe?.image?.url}
                              />
                            </AspectRatio>
                          ) : (
                            <IconContext.Provider
                              value={{ color: '#737373', size: '2em' }}
                            >
                              <div>
                                <BiCameraOff />
                              </div>
                            </IconContext.Provider>
                          )}
                        </Box>

                        <Text
                          as='h2'
                          weight={700}
                          size={{ '@initial': 2, '@bp1': 9 }}
                          css={{ flex: 1 }}
                        >
                          {recipe?.title}
                        </Text>
                      </Stack>
                      <Stack direction='row' css={{ ai: 'center' }}>
                        <Stack
                          padding='sm'
                          css={{
                            opacity: '0.5',
                            color: 'orange',
                            fontSize: '2rem',
                          }}
                        >
                          {recipe?.vegetarian && <FaCarrot />}
                        </Stack>
                        <Stack padding='sm'>
                          <IoToday />
                          <Text
                            as='h3'
                            weight={700}
                            size={7}
                            css={{ textAlign: 'center', paddingTop: '10px' }}
                          >
                            {recipe?.days}
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
                            {recipe?.persons}
                          </Text>
                        </Stack>
                      </Stack>
                    </Flex>
                  </Card>
                </Link>
              )
            })}
          </Stack>
        </Box>
      </Stack>
    </Canvas>
  )
}
