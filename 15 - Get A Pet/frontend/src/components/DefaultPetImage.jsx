import image from '../assets/pet-icon.png'

const DefaultPetImage = ({ classImg = null }) => {
    return (
        <>
            <img className={classImg} src={image} />
        </>
    )
}

export default DefaultPetImage