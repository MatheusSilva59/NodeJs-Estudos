import DefaultPetImage from "./DefaultPetImage"

const ConditionalPetImage = ({ source, classImg = 'block-img' }) => {
    return (
        <>
            {source ?
                (
                    <img className={classImg} src={source} />
                ) :
                (
                    <DefaultPetImage classImg={classImg ? classImg : undefined} />
                )
            }
        </>
    )

}

export default ConditionalPetImage