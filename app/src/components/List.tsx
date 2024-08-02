
function List () {
  return (
    <div>
      <div className="section">
        <h3>Produce</h3>
        <div>
          <input type="checkbox" name="" id="" />
          Apples
        </div>
        <div>
          <input type="checkbox" name="" id="" />
          Onions
        </div>
      </div>
      <div className="section">
        <h3>Meat</h3>
        <div>
          <input type="checkbox" name="" id="" />
          Steak
        </div>
      </div>
      <div className="section">
        <h3>Dairy</h3>
        <div>
          <input type="checkbox" name="" id="" />
          Milk
        </div>
        <div>
          <input type="checkbox" name="" id="" />
          Cheese
        </div>
      </div>
    </div>
  )
}

function Item(item: any) {
  return (
    <div>
      <input type="checkbox" />
    </div>
  )
}

export default List;