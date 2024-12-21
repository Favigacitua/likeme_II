import pkg from "pg";


const { Pool } = pkg;
const pool = new Pool ({
    host: 'localhost',
    user: 'postgres',
    password: 'shin',
    database: 'likeme',
    allowExitOnIdle: true
});


export const getPost = async () => {
    try {
        const { rows } = await pool.query('SELECT * FROM posts');
        return rows;
    } catch (error) {
        console.error("Error al obtener los posts:", error.message);
        throw new Error("Error al obtener los posts");
    }
};

export const postPost = async (titulo,img,descripcion) => {
    try{
        const consulta = "INSERT INTO posts (titulo, img, descripcion, likes) values ( $1,$2,$3,$4) RETURNING *";
        const values = [titulo,img,descripcion,0];
        const result = await pool.query(consulta, values);
        return result.rows[0]  
    }catch(error){
        console.error("Error al agregar post", error.message);
    }
};

export const putPost = async (id)=> {
    try {
        const result = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
        
        if (result.rowCount === 0) {
            return { status: 404, message: 'Post no encontrado' };
        }
        const post = result.rows[0];
        const newLike = post.likes + 1;
        
        await pool.query(
            'UPDATE posts SET likes = $1 WHERE id = $2',
            [newLike, id]
        );

        return { status: 200, message: 'Nuevo like' };
    } catch (error) {
        console.error("Error al hacer like", error.message);
        return { status: 500, message: 'no se pudo dar un like :(' };
    }
   
    }



export const eliminarPost = async(id)=> {
    const consulta = "DELETE FROM posts WHERE id = $1";
    const values = [id];
    try {
        const result = await pool.query(consulta, values);

        if (result.rowCount === 0) {
            return { status: 404, message: 'Post no encontrado' };
        }

        return { status: 200, message: 'Post eliminado exitosamente' };
    } catch (error) {
        console.error('Error al eliminar el post:', error.message);
        return { status: 500, message: 'Error al eliminar el post' };
    }

}

export default {getPost, postPost, putPost, eliminarPost}