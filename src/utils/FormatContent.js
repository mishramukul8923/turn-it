const formatContent = (text) => {
    // Check if the text is a string
    console.log("this recieved text", text.content)
    if (typeof text.content !== 'string') {
        console.error('Expected string but received:', text);
        return <span>No valid content available.</span>;
    }

    // Split and map to replace newlines with <br />
    return text.content.split('\n').map((item, index) => (
        <span key={index}>
            {item}
            <br />
        </span>
    ));
};


export default formatContent;