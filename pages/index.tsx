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
} from '@xooom/ui'
import Link from 'next/link'
import NextImage from 'next/image'
import { FaCarrot } from 'react-icons/fa'
import { GrGroup } from 'react-icons/gr'
import { IoToday } from 'react-icons/io5'
import { useState } from 'react'

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
  const [checked, setChecked] = useState(false)
  const recipesFilter = checked
    ? recipes.filter((recipe) => recipe.vegetarian)
    : recipes

  return (
    <Canvas padding='lg'>
      <Center>
        <Box className='wrapper'>
          <Flex
            css={{ jc: 'space-between', ai: 'center', marginBottom: '30px' }}
          >
            <Text as='h1' weight={700} size={6}>
              Opskrifter til Vervuurt/Nielsen-husholdningen
            </Text>
            <Checkbox
              label='Vegetarisk'
              checked={checked}
              onCheckedChange={() => setChecked(!checked)}
            ></Checkbox>
          </Flex>
          <Stack gap='md'>
            {recipesFilter.map((recipe) => {
              return (
                <Link
                  key={recipe.id}
                  as={`/recipe/${recipe.slug}`}
                  href='/recipe/[slug]'
                >
                  <Card padding='md' css={{ maxWidth: '100%' }}>
                    <Flex css={{ ai: 'center', jc: 'space-between' }}>
                      <Stack direction='row' css={{ flex: 1 }}>
                        <AspectRatio ratio={1}>
                          <Image
                            alt={recipe.title}
                            src={recipe.image.url}
                            width={100}
                            height={100}
                          />
                        </AspectRatio>
                        <Text as='h2' weight={700} size={5}>
                          {recipe.title}
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
                </Link>
              )
            })}
          </Stack>
        </Box>
      </Center>
    </Canvas>
  )
}
