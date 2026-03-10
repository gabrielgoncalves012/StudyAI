import { api, useJwtToken } from "../Api";

export class UsuarioService {
    async AboutUser(id) {
        try {
            useJwtToken()
            const response = await api.get(`/usuarios`)
            return response.data
        } catch (error) {
            return {
                message: 'Error fetching user',
                error: error.message
            }
        }
    }
}