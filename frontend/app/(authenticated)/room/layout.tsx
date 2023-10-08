import { Box } from "@chakra-ui/react"
import { ReactNode } from "react"

export default function BaseLayout({ children }: { children: ReactNode }) {
  return <Box pt={{ base: '130px', md: '130px', xl: '130px' }}>
    {children}
  </Box>
}