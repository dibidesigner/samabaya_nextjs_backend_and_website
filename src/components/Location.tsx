export default function Location(){
    return(
         <div className="col-span-1 w-full h-44  lg:h-[300px]">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d4450.415624719326!2d85.84710650250547!3d20.286249477871397!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1754651651136!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
                </div>
    )
}