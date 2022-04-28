// import platform from "./img/xxx.png"

const canvas = document.querySelector("#game")

const c = canvas.getContext("2d")

canvas.width = innerWidth   // window is referenced
canvas.height = innerHeight

//  * when colision true feet on ground
//  * and then make it so you can jump
//  * can make double jump like this too
//  * by making an available jump counter


const gravity = .5
let gameSpeed = .1 // scroll speed auto should ramp up
let gameState = true

// ============================================================================= char
class Player {
    constructor() {
        this.position = {
            x:        100,
            y:        100,
        }
        this.velocity = {
            x:        0,
            y:        0
        }

        this.width  = 30
        this.height = 30
    }

    draw() {
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.y + this.height + this.velocity.y <= canvas.height)
            this.velocity.y += gravity
        else this.velocity.y = 0
    }
}
// ============================================================================= platform
class Platform {
    constructor({x,y,width,height}) {
        this.position = {
            x,          // means x: x 
            y           // ditto
        }
        this.width  = 200
        this.height = 20
    }
    draw() {
        c.fillStyle= 'blue'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

// ========================================= this should be what im controlling
class Cactus {
    constructor({x,y,width,height}) {
        this.position = {
            x,
            y
        }
        this.width   = 50
        this.height  = 100
    }

    draw() {
        c.fillStyle= 'green'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.y + this.height + this.velocity.y <= canvas.height)
            this.velocity.y += gravity
        else this.velocity.y = 0
    }
}
class GenericObject {
    constructor({x,y,width,height}) {
        this.position = {
            x,          // means x: x 
            y           // ditto
        }

        this.width = 200
        this.height = 20
    }

    draw() {
        c.fillStyle = 'blue'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

class EndScreen {
    constructor({x,y,width,height}) {
        this.position = {
            x,
            y,
        }
        this.width  = 400
        this.height = 300
    }

    drawWin() {
        c.fillStyle = "green"
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    drawLoss() {
        c.fillStyle = "red"
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}
// ========================================================================== Game objects


const player = new Player() // player
const platforms = [new Platform({x:200,y:500}
), new Platform({x:500,y:600})] // platform

const genericObjects = [
    new GenericObject({x:0,y:0,}) // add image for dead thingy
    //  new GenericObject({x:0,y:0,image})
]

const cactus = [new Cactus({x:200,y:800}
    ), new Cactus({x:300,y:900})] // platform

// ============================================================================ controls
const keys = {
    right:   { pressed: false },
    left:    { pressed: false },
    up:      { pressed: false },
    down:    { pressed: false }
}

// ============================================================================= scroll tracker
let scrollOffset = 0

// ============================================================================= movement
function animate() {
    requestAnimationFrame(animate)
    c.clearRect(0,0,canvas.width,canvas.height)
    // ================== updating and drawing
    platforms.forEach(platform => {
        platform.draw()
    })
    player.update()
    cactus.forEach(cactus => {
        cactus.draw()
    })

    // for left and right
    if (keys.right.pressed && player.position.x < 400) {
        player.velocity.x                       = 5
    }else if (keys.left.pressed&& player.position.x > 100) {
        player.velocity.x                       = -5
    }else { 
        player.velocity.x                       = 0
        if (keys.right.pressed) {
            scrollOffset                        += 5
            platforms.forEach(platform => {
                platform.draw()
                platform.position.x             -= 5
            })
        }
        else if (keys.left.pressed){
            scrollOffset                        -= 5
            platforms.forEach(platform => {
                platform.draw()
                platform.position.x             += 5
            })
        }
    }

    // console.log("scroll: ",scrollOffset, "x: ", player.position.x) 
    cactus.forEach(cactus => {
        if (                    
               player.position.y + player.height                        <= cactus.position.y 
            && player.position.y + player.height + player.velocity.y    >= cactus.position.y 
            && player.position.x + player.width                         >= cactus.position.x 
            && player.position.x                                        <= cactus.position.x + cactus.width 
        ) 
            {
            player.velocity.y = 0
            console.log("you lose: TOP HITBOX of cactus")
            gameState = false
            }
        
        if (
                player.position.y                       <= cactus.position.y + cactus.height 
            &&  player.position.y - player.velocity.y   >= cactus.position.y + cactus.height
            &&  player.position.x                       <= cactus.position.x + cactus.width
            &&  player.position.x + player.width        >= cactus.position.x
        ) {
            player.velocity.y = 0
            console.log("you lose: BOTTOM HITBOX of cactus")
            gameState = false
        }

        if (
                player.position.x                       <= cactus.position.x + cactus.width
            &&  player.position.x + player.width        >= cactus.position.x
            &&  player.position.y                       <= cactus.position.y + cactus.height
            &&  player.position.y + player.height       >= cactus.position.y
        ) {
            player.velocity.x = 0
            console.log("you lose: SIDE HITBOX of cactus")
            gameState = false
        }

        // if (
        //         player.position.x                       >= cactus.position.x
        // )
    })

    // collision *** oh god this is ugly to see if you know how to make it better pls do tell
    platforms.forEach(platform => {
    if (
        player.position.y + player.height                           <= platform.position.y 
        && player.position.y + player.height + player.velocity.y    >= platform.position.y 
        && player.position.x + player.width                         >= platform.position.x 
        && player.position.x                                        <= platform.position.x +     platform.width) {
        player.velocity.y = 0
        }
    })

    if (scrollOffset > 2000 ) {
        console.log("you win")
    }
}
animate()

// ============================================================================= event listeners

addEventListener('keydown', ({ keyCode }) => {
    switch ( keyCode ) {
        case 65:
            keys.left.pressed = true 
            break;
        case 83:
            // keys.down.pressed = true 
            break;
        case 68:
            keys.right.pressed = true 
            break;
        case 87:
            if (player.velocity.y == 0) {
                player.velocity.y -= 20
            }
            // keys.up.pressed = true 
            break;
    }
})

addEventListener('keyup', ({ keyCode }) => {
    switch ( keyCode ) {
        case 65:
            keys.left.pressed = false 
            break;
        case 83:
            // keys.down.pressed = false 
            break;
        case 68:
            keys.right.pressed = false 
            break;
        case 87:
            // keys.up.pressed = false 
            break;
    }
})