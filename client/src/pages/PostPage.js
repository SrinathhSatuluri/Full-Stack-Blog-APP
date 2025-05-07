import {useEffect} from "react";
import {useParams} from "react-router-dom";

export default function PostPage() {
    const [postInfo, setPostInfo] = useStae(null);
    const {id} = useParams();
    const params = useParams();
    useEffect(() => {
        
        fetch('http://localhost:4000/post/')
            .then(response => {
                response.json().then(postInfo => {
                    setPostInfo(postInfo);

                });

            });

    }, []);

    if (!postInfo) return '';

    return (
<div className="post-page">
    <div className="post-page">
        <div className="image">    
        <img src={'http://localhost:4000/${postInfo.cover}'} alt=""/>
        </div>
    </div>
    <h1>{postInfo.title}</h1>
 <div dangerouslySetInnerHTML={postInfo.content}/>
</div>  

    );

}