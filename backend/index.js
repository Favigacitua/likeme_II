import express from 'express'
import { getPost, postPost,putPost, eliminarPost } from './consulta.js'
import cors from 'cors'


const app = express()
const port = 3000


app.use(cors());
app.use(express.json());

app.get('/posts', async (req, res)=>{
    try {
        const obtener = await getPost()
        res.json(obtener);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los posts' });
    }
});

app.post("/posts", async (req, res) => {
    const { titulo, img, descripcion, likes } = req.body;
    
    try {
        
       const newPost= await postPost(titulo, img, descripcion, likes);
        
        res.status(201).json(newPost);
    } catch (error) {
        console.error("Error al agregar el post:", error.message);
        res.status(500).send("Error al agregar el post");
    }
});
 
app.put('/posts/like/:id', async (req, res)=> {
    const {id} = req.params
    
    try {
        const response = await putPost(id);
        res.status(response.status).send(response.message);
    } catch (error) {
        res.status(response.status).send(response.message);
    }
})

app.delete('/posts/:id', async (req, res)=> {
    const {id} = req.params
    try {
        const response = await eliminarPost(id);
        res.status(response.status).send(response.message);
    } catch (error) {
        res.status(500).send('Error al eliminar el post');
    }
});


app.listen(port, ()=> {
    console.log(`servidor corriendo en el http://localhost:${port}`)
})