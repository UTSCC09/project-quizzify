import {
  useEffect, useState,
} from "react";
import { useAuth0 } from '@auth0/auth0-react';
import * as USER_API from "@/api/users";

import { useRouter } from "next/router";
import Profile from ".";
import { getToast } from "@/constants";
import { useToast } from "@chakra-ui/react";

export default function ProfileSelectedUser() {
  const {
    isAuthenticated,
    getAccessTokenSilently,
  } = useAuth0();

  const router = useRouter()
  const userId = router.query.userId

  const toast = useToast();

  const [selectedUser, setSelectedUser] = useState({})
  useEffect(() => {
    const getUser = async (userId) => {
      const accessToken = isAuthenticated ? await getAccessTokenSilently() : null
      const response = await USER_API.getUserById(accessToken, userId)
      if (response[0].status == 200 && response.length > 1) {
        setSelectedUser(response[1])
      } else
        toast(getToast('Failed to get user', false))
    }
    if (userId) getUser(userId)
  }, [router.query.userId])

  return <Profile selectedUser={selectedUser} />
}