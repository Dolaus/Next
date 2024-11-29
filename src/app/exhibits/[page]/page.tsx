export default function Page({ params }: { params: { page: string } }) {
    return (
        <div>
            <h1>Передане ID:</h1>
            <p>{params.page}</p>
        </div>
    );
}
