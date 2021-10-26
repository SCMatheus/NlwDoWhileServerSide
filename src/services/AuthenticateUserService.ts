/*
Receber code(string)
Recuperar o access_token no github
Recuperar infos do user no github
Verificar se o usuário exite no DB
-----Sim = Gera um token
-----Não = Cria no Db, gera um token
Retornar o token com as infos do user
*/
import axios from "axios"
import prismaClient from "../prisma"
import { sign } from "jsonwebtoken"

interface IAccessTokenResponse {
  access_token: string
}

interface IUserResponse {
  avatar_url: string,
  login: string,
  id: number,
  name: string
}

class AuthenticateUserService {
  async execute(code: string, web: boolean) {
    const url = "https://github.com/login/oauth/access_token";

    const { data: accessTokenResponse } = 
      await axios.post<IAccessTokenResponse>(url, null, {
        params: {
          client_id: web ? process.env.GITHUB_WEB_CLIENT_ID : process.env.GITHUB_APP_CLIENT_ID,
          client_secret: web ? process.env.GITHUB_WEB_CLIENT_SECRET : process.env.GITHUB_APP_CLIENT_SECRET,
          code,
        },
        headers: {
          "Accept": "application/json"
        }
      })

    const {data: userResponse} = await axios.get<IUserResponse>("https://api.github.com/user", {
      headers: {
        authorization: `Bearer ${accessTokenResponse.access_token}`
      }
    })

    const { login, id, avatar_url, name } = userResponse

    let user = await prismaClient.user.findFirst({
      where: {
        github_id: id
      }
    })

    if(!user) 
      user = await prismaClient.user.create({
        data: {
          github_id: id,
          login,
          avatar_url,
          name
        }
      })

    const token = sign({
      user: {
        name: user.name,
        avatar_url: user.avatar_url,
        id: user.id
      }
    },
      process.env.JWT_SECRET,
      {
        subject: user.id,
        expiresIn: "1d"
      }
    )

    return { token, user };
  }
}

export { AuthenticateUserService }