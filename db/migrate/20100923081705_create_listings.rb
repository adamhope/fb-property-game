class CreateListings < ActiveRecord::Migration
  def self.up
    create_table :listings do |t|
      t.integer :price
      t.string :price_view
      t.integer :bedrooms
      t.integer :bathrooms
      t.string :suburb
      t.string :state
      t.integer :postcode

      t.timestamps
    end
  end

  def self.down
    drop_table :listings
  end
end
