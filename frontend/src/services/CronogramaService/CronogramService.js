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
            return response.data;
        } catch (error) {
            console.error('Error creating cronograma:', error);
            throw error;
        }
    }

    async deleteCronograma(id) {
        try {
            await api.delete(`/cronograma/${id}/`)
        } catch (error) {
            
        }
    }
}