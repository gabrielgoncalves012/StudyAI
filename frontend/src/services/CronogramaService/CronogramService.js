import { api, useJwtToken } from '../Api.js';

export class CronogramaService {
    async findAllCronogramas() {
        try {
            useJwtToken(); // Ensure the JWT token is set in the headers
            const response = await api.get('/cronogramas/');
            console.log('Response data:', response.data);
            return response.data;

        } catch (error) {
            
        }
    }

    async findCronogramaById(id) {
        try {
            useJwtToken()
            const response = await api.get(`/cronograma/${id}`)
            console.log('Response data:', response.data)
            return response.data;
            
        } catch(error) {

        }
    }

    async checkTopic(id) {
        try {
            
            useJwtToken()
            await api.get(`/cronograma/topico/${id}/`)
            

        } catch (error) {
            
        }
    }

    async createCronograma(cronograma) {
        try {
            const response = await api.post('/cronograma/', cronograma, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return {
                status: response.status,
                data: response.data
            };
        } catch (error) {
            if(error.response?.status === 403) {
                if(error.response.data.permission == false) {
                    return {
                        status: error.response.status,
                        data: error.response.data
                    };
                } else if(error.response.data.limit > 0) {
                    console.log(error.response.data.message)
                    return {
                        status: error.response.status,
                        data: {
                            message: error.response.data.message,
                            description: error.response.data.message
                        }
                    };

                    console.log(error.response.data.message)
                }
            }
        }
    }

    async deleteCronograma(id) {
        try {
            await api.delete(`/cronograma/${id}/`)
        } catch (error) {
            
        }
    }
}