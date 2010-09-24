# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20100924013534) do

  create_table "listings", :force => true do |t|
    t.integer  "price"
    t.string   "price_view"
    t.integer  "bedrooms"
    t.integer  "bathrooms"
    t.string   "suburb"
    t.string   "state"
    t.integer  "postcode"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.text     "image_url"
  end

  create_table "users", :force => true do |t|
    t.decimal  "facebook_id", :precision => 10, :scale => 0
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "best_streak", :default => 0
    t.integer  "score", :default => 0
  end

end
